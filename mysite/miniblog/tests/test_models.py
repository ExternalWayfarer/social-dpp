import pytest
from django.utils import timezone


from ..models.user import CustomUser
from ..models.topic import Topic
from ..models.post import Post

# decorator @pytest.mark.django_db for tests in db
@pytest.mark.django_db
def test_create_post():
    """
    instance creation test
    """

    author = CustomUser.objects.create_user(
        email='testauthor@example.com',
        password='testpassword123'
    )
    topic = Topic.objects.create(
        name='Discussions',
        #slug='discussions'
    )

    post_title = "My first testing post"
    post_body = "TEST...."

    post_status = Post.Status.PUBLISHED
    post_published_date = timezone.now()

    post = Post.objects.create(
        title=post_title,
        body=post_body,
        author=author,
        topic=topic,
        status=post_status,
        published_date=post_published_date,
    )

    assert post.pk is not None
    assert post.title == post_title
    assert post.body == post_body
    assert post.author == author
    assert post.topic == topic
    assert post.status == post_status
    assert post.published_date == post_published_date

    assert Post.objects.count() == 1
    retrieved_post = Post.objects.get(pk=post.pk)
    assert retrieved_post.title == post_title

    # assert str(post) == post_title